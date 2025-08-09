"use client"

import { useState } from "react"
import { toast } from "sonner"

const useFetch = (cb) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const func = async (...args) => {
        setLoading(true)
        setError(null)

        try {
            const response = await cb(...args)
            setData(response)
            setError(null)
        } catch (error) {
            setError(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { data, loading, error, func, setData }
}

export default useFetch
