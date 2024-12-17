"use client";

import { DataTable } from "@repo/ui";
import { WalletStatementColumns } from "./WalletStatementColumn";
import { useSelector } from "react-redux";
import { RootState } from "@/store/root-reducer";

export default function WalletStatementTable() {
  const walletTableDate = useSelector(
    (state: RootState) => state.walletTableData
  );

  return (
    <div>
      <DataTable
        columns={WalletStatementColumns}
        data={walletTableDate}
        // isSearch={false}
        // varient="brown"
      />
    </div>
  );
}
