"use client";

import useSeller from '@/hooks/useSeller';
import useSidebar from '@/hooks/useSidebar'
import React, { useEffect } from 'react'
import Box from './box';
import Link from 'next/link';
import { Sidebar } from './sidebar.styles';
import { usePathname } from 'next/navigation';
import Logo from '@/assets/svgs/logo';
import SidebarItem from './sidebar.item';
import { BellPlus, BellRing, CalendarPlus, Home, ListOrdered, LogOut, Mail, Settings } from 'lucide-react';
import SidebarMenu from './sidebar.menu';

const SidebarBarWrapper = () => {
     const { activeSidebar, setActiveSidebar } = useSidebar()
    const pathName = usePathname()
    const {seller} = useSeller();

    console.log(seller)

    useEffect(() => {
        setActiveSidebar(pathName);
    }, [pathName, setActiveSidebar])

     const getIconColor = (route: string) => activeSidebar === route ? "#0085ff" : "#969696"

   // return(<div>SidebarBarWrapper</div>)

  return (
    <Box
      css={{
        height: "100vh",
        zIndex: 202,
        position: "sticky",
        padding: "8px",
        top: "0",
        overflowY: "scroll",
        scrollbarWidth:"none",

      }}
      className='sidebar-wrapper'
    >
      <Sidebar.Header>
        <Box>
          <Link href={"/"} className='flex justify-center gap-2 text-center'>
            <Logo />
            <Box>
              <h3 className='text-xl font-medium text-[#ecedee]'>{seller?.shop?.name}</h3>
              <h5 className='font-medium pl-2 text-xs text-[#ecedeecf] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]'>
                {seller?.shop?.address}
              </h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>
      <div className='block h-full my-3'>
        <Sidebar.Body className='body sidebar'>
            <SidebarItem 
              title='Dashboard'
              icon={<Home fill={getIconColor("/dashboard")}/>}
              isActive={activeSidebar === "/dashboard"}
              href='/dashboard'
            />
            <div className='block mt-2'>
              <SidebarMenu title='Main Menu'>
                <SidebarItem 
                  title='Orders'
                  icon={<ListOrdered size={26} fill={getIconColor("/dashboard/orders")}/>}
                  isActive={activeSidebar === "/dashboard/orders"}
                  href='dashboard/orders'
                />
                <SidebarItem 
                  title='Payments'
                  icon={<ListOrdered size={26} fill={getIconColor("/dashboard/payments")}/>}
                  isActive={activeSidebar === "/dashboard/payments"}
                  href='dashboard/payments'
                />
              </SidebarMenu>
                 <SidebarMenu title='Products'>
                <SidebarItem 
                  title='Create Product'
                  icon={<ListOrdered size={26} fill={getIconColor("/dashboard/create-product")}/>}
                  isActive={activeSidebar === "/dashboard/create-product"}
                  href='dashboard/create-product'
                />
                <SidebarItem 
                  title='All Products'
                  icon={<ListOrdered size={26} fill={getIconColor("/dashboard/all-products")}/>}
                  isActive={activeSidebar === "/dashboard/all-products"}
                  href='dashboard/all-products'
                />
              </SidebarMenu>
              <SidebarMenu title='Events'>
                <SidebarItem 
                  title='Create Event'
                  icon={<CalendarPlus size={26} fill={getIconColor("/dashboard/create-event")}/>}
                  isActive={activeSidebar === "/dashboard/create-event"}
                  href='dashboard/create-event'
                />
                <SidebarItem 
                  title='All Events'
                  icon={<BellPlus size={26} fill={getIconColor("/dashboard/all-events")}/>}
                  isActive={activeSidebar === "/dashboard/all-events"}
                  href='dashboard/all-events'
                />
              </SidebarMenu>
               <SidebarMenu title='Controllers'>
                <SidebarItem 
                  title='Inbox'
                  icon={<Mail size={26} fill={getIconColor("/dashboard/inbox")}/>}
                  isActive={activeSidebar === "/dashboard/inbox"}
                  href='dashboard/inbox'
                />
                <SidebarItem 
                  title='Settings'
                  icon={<Settings size={26} fill={getIconColor("/dashboard/settings")}/>}
                  isActive={activeSidebar === "/dashboard/settings"}
                  href='dashboard/settings'
                />
                  <SidebarItem 
                  title='Notifications'
                  icon={<BellRing size={26} fill={getIconColor("/dashboard/notifications")}/>}
                  isActive={activeSidebar === "/dashboard/notifications"}
                  href='dashboard/notifications'
                />
              </SidebarMenu>

              <SidebarMenu title='Extras'>
                <SidebarItem 
                  title='Discount Codes'
                  icon={<Mail size={26} fill={getIconColor("/dashboard/discount-codes")}/>}
                  isActive={activeSidebar === "/dashboard/discount-codes"}
                  href='dashboard/discount-codes'
                />
                <SidebarItem 
                  title='Logout'
                  icon={<LogOut size={26} fill={getIconColor("/dashboard/logout")}/>}
                  isActive={activeSidebar === "/dashboard/logout"}
                  href='dashboard/logout'
                />
                  
              </SidebarMenu>
              
            </div>
        </Sidebar.Body>
      </div>
    </Box>
  )
}

export default SidebarBarWrapper