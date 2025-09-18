import { query } from "./_generated/server";
import { internal } from "./_generated/api"
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllContacts = query({
    handler: async (ctx) => {
        const currUser = await ctx.runQuery(internal.users.getCurrentUser);

        const expensesyouPaid = await ctx.db.query("expenses").withIndex("by_user_and_group", (q) => 
            q.eq("paidByUserId", currUser._id).eq("groupId", undefined)
        ).collect();

        const expensesyouNotPaid = (await ctx.db.query("expenses").withIndex("by_group", (q) => 
            q.eq("groupId", undefined)
        ).collect()).filter((e) =>
            e.paidByUserId !== currUser._id &&
            e.splits.some((s) => s.userId === currUser._id)
        );

        const personalExpenses = [...expensesyouPaid, ...expensesyouNotPaid];

        const contactIds = new Set();
        personalExpenses.forEach((exp) => {
            if (exp.paidByUserId !== currUser._id) {
                contactIds.add(exp.paidByUserId);
            }
            exp.splits.forEach((split) => {
                if (split.userId !== currUser._id) {
                    contactIds.add(split.userId);
                }
            });
        });

        const contactUsers = await Promise.all(
            [...contactIds].map(async (id) => {
                const u = await ctx.db.get(id);
                return u ? {
                    _id: u._id,
                    name: u.name,
                    email: u.email,
                    imageUrl: u.imageUrl,
                    type: "user",
                } : null;
            })
        );

        const userGroups = (await ctx.db.query("groups").collect()).filter(g => g.members.some(m => m.userId === currUser._id)).map((g) => ({
            id: g._id,
            name: g.name,
            description: g.description,
            memberCount: g.members.length,
            type: "group",
        }));

        contactUsers.sort((a, b) => a?.name.localeCompare(b?.name));
        userGroups.sort((a, b) => a?.name.localeCompare(b?.name));

        return { users: contactUsers.filter(Boolean), groups: userGroups };
    }
})

export const createGroup = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
        members: v.array(v.id("users")),
    },
    handler: async (ctx, args) => {
        const currUser = await ctx.runQuery(internal.users.getCurrentUser);

        if(!args.name.trim()) {
            throw new Error("Group name cannot be empty");
        }

        const uniqueMembers = new Set(args.members);
        uniqueMembers.add(currUser._id);

        for(const id of uniqueMembers) {
            if(!(await ctx.db.get(id))) {
                throw new Error("User with id " + id + " does not exist");
            }
        }

        return await ctx.db.insert("groups", {
            name: args.name.trim(),
            description: args.description?.trim() ?? "",
            createdBy: currUser._id,
            members: [...uniqueMembers].map(id => ({ userId: id, role: id === currUser._id ? "admin" : "member", joinedAt: Date.now() })),
        });
    }
})