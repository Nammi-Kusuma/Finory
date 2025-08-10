"use client"

import React, { useEffect, useRef } from 'react'
import useFetch from '@/hooks/use-fetch'
import { scanReceipt } from '@/actions/transactions'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Camera } from 'lucide-react'

const ReceiptScanner = ({ onScan }) => {
    const fileInputRef = useRef(null);

    const { loading: scanReceiptLoading, func: ReceiptScanFunc, data: scannedData } = useFetch(scanReceipt);

    const handleScan = async (file) => {
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size should be less than 5MB");
            return;
        }

        await ReceiptScanFunc(file);
    };

    useEffect(() => {
        if (scannedData && !scanReceiptLoading) {
            onScan(scannedData);
            toast.success("Receipt scanned successfully");
        }
    }, [scanReceiptLoading, scannedData]);

    return (
        <div>   
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleScan(file);
                }}
            />

            <Button
                type="button"
                variant="outline"
                className="w-full h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 animate-gradient hover:opacity-90 transition-opacity text-white hover:text-white"
                onClick={() => fileInputRef.current?.click()}
                disabled={scanReceiptLoading}
            >
                {scanReceiptLoading ? (
                    <>
                        <Loader2 className="mr-2 animate-spin" />
                        <span>Scanning Receipt...</span>
                    </>
                ) : (
                    <>
                        <Camera className="mr-2" />
                        <span>Scan Receipt with AI</span>
                    </>
                )}
            </Button>
        </div>
    )
}

export default ReceiptScanner
