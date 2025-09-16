import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, CreditCard, PieChart, Bell, Receipt } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import hero from '@/public/hero.png'
import { Card } from '@/components/ui/card'

const FEATURES = [
  {
    title: "Group Management",
    Icon: Users,
    bg: "bg-green-100",
    color: "text-green-600",
    description: "Create and manage groups with to keep expenses organized",
  },
  {
    title: "Smart Settlements",
    Icon: CreditCard,
    bg: "bg-green-100",
    color: "text-green-600",
    description: "Our algorithm minimises the number of payments when settling up.",
  },
  {
    title: "Expense Analytics",
    Icon: PieChart,
    bg: "bg-green-100",
    color: "text-green-600",
    description: "Track your expenses and get insights into your spending habits.",
  },
  {
    title: "Payment Reminders",
    Icon: Bell,
    bg: "bg-green-100",
    color: "text-green-600",
    description: "Never miss a payment again with our automated reminders.",
  },
  {
    title: "Multiple Split Methods",
    Icon: Receipt,
    bg: "bg-green-100",
    color: "text-green-600",
    description: "Split expenses with ease using multiple split methods - equal, exact, and percentage.",
  },
];

const STEPS = [
  {
    label: "1",
    title: "Create or Join a Group",
    description: "Start a group for you and your friends or join an existing group."
  },
  {
    label: "2",
    title: "Add Expenses",
    description: "Add expenses to your group and split them with your friends."
  },
  {
    label: "3",
    title: "Settle Up",
    description: "Settle up with your friends and never worry about who owes who again."
  }
]

const Page = () => {
  return (
    <div className='flex flex-col pt-16'>
      <section className="mt-20 pb-12 space-y-10 md:space-y-15 px-5">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <Badge variant="outline" className="bg-green-100 text-green-700">
            Split expenses. Simplify life.
          </Badge>

          <h1 className="gradient-title-splito mx-auto max-w-6xl text-4xl font-bold md:text-8xl">
            Split expenses with ease
          </h1>

          <p className="mx-auto max-w-6xl text-xl text-gray-600">
            Splito is a simple and easy-to-use expense-splitting app that helps you split expenses with your friends and family. Never worry about who owes who again.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row justify-center">
            <Button
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              <Link href="/splito/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>

        <div className="container mx-auto max-w-5xl overflow-hidden rounded-xl shadow-xl">
          <div className="gradient p-1 aspect-[16/9]">
            <Image
              src={hero}
              width={1280}
              height={720}
              alt="Banner"
              className="rounded-lg mx-auto"
              priority
            />
          </div>
        </div>
      </section>

      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge variant="outline" className="bg-green-100 text-green-700">
            Features
          </Badge>
          <h2 className="gradient-title-splito mt-2 text-3xl md:text-4xl">
            Everything you need to split expenses
          </h2>
          <p className="mx-auto mt-3 max-w-[700px] text-gray-500 md:text-xl/relaxed">
            Our platform provides all the tools you need to handle shared
            expenses with ease.
          </p>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ title, Icon, bg, color, description }) => (
              <Card
                key={title}
                className="flex flex-col items-center space-y-4 p-6 text-center"
              >
                <div className={`rounded-full p-3 ${bg}`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>

                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-gray-500">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge variant="outline" className="bg-green-100 text-green-700">
            How It Works
          </Badge>
          <h2 className="gradient-title-splito mt-2 text-3xl md:text-4xl">
            Splitting expenses has never been easier
          </h2>
          <p className="mx-auto mt-3 max-w-[700px] text-gray-500 md:text-xl/relaxed">
            Follow these simple steps to start tracking and splitting expenses
            with friends.
          </p>

          <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
            {STEPS.map(({ label, title, description }) => (
              <div key={label} className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
                  {label}
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-gray-500 text-center">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 gradient-splito">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-white">
            Ready to simplify expense sharing?
          </h2>
          <p className="mx-auto max-w-[600px] text-green-100 md:text-xl/relaxed">
            Join thousands of users who have made splitting expenses
            stress‑free.
          </p>
          <Button asChild size="lg" className="bg-green-800 hover:opacity-90">
            <Link href="/splito/dashboard">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

export default Page
