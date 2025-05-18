import { getTatansaction } from "@/app/actions";
import React, { useEffect, useState } from "react";
import { PositionDataTable } from "../positions/positon-data-table";
import { transactionColounm } from "./TransactionColumn";

export const TransactionList = ({ id }: { id: string }) => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    getTatansaction(id).then((res) => setData(res));

    return () => {};
  }, []);

  return (
    <PositionDataTable
      columns={transactionColounm}
      data={data}
      showColumnVisibility={false}
    />
  );
};
