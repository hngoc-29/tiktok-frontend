"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, Tab } from "@mui/material";
import FollowList from "@/components/FollowList";

export default function FollowPage() {

    return (
        <div>
            <FollowList />
        </div>
    );
}
