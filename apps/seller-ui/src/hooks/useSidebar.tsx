"use client";

import { activeSideBarItem } from "@/configs/constants";
import { useAtom } from "jotai"

const useSidebar = () => {
    const [activeSidebar, setActiveSidebar] = useAtom(activeSideBarItem); // Jotai Library
 
    return {activeSidebar, setActiveSidebar}
}

export default useSidebar