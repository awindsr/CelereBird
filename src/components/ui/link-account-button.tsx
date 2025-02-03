"use client"
import React from 'react'
import { Button } from './button'
import { getAurinkoAuthUrl } from '@/lib/aurinko'

const LinkAccountButton = () => {
  return (
    <Button onClick={async()=>{
        const authUrl = await getAurinkoAuthUrl('Google');
        // console.log(authUrl);
        window.location.href = authUrl;
    }}>
        Link account
    </Button>
  )
}

export default LinkAccountButton