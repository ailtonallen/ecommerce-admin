"use client";

import { useEffect } from "react";
import { useStoreModal } from "@/hooks/use-store-modal";
import { UserButton } from "@clerk/nextjs";


const SetupPage = () => {
  const onOpen = useStoreModal((state) =>state.onOpen);
  const isOpen = useStoreModal((state) =>state.isOpen);

  useEffect(()=>{
    if(!isOpen){
      onOpen();
    }
  }, [isOpen, onOpen]);

    return (
    <div className="p-5">
      <UserButton afterSignOutUrl="/"/>
<div className="p-4">
Root
</div>
    </div>
  );
}
export default SetupPage;