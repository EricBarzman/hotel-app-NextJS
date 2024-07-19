"use client";

import { useState } from "react"
import Search from "../Search/Search"

function PageSearch() {

  const [roomTypeFilter, setRoomTypeFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return <Search
            roomTypeFilter={roomTypeFilter}
            searchQuery={searchQuery}
            setRoomTypeFilter={setRoomTypeFilter}
            setSearchQuery={setSearchQuery}
          />
}

export default PageSearch