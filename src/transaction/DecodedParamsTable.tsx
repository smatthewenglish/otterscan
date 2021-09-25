import React from "react";
import { ParamType, Result } from "@ethersproject/abi";
import DecodedParamRow from "./DecodedParamRow";
import { TransactionData } from "../types";

type DecodedParamsTableProps = {
  args: Result;
  paramTypes: ParamType[];
  txData: TransactionData;
  hasParamNames?: boolean;
};

const DecodedParamsTable: React.FC<DecodedParamsTableProps> = ({
  args,
  paramTypes,
  txData,
  hasParamNames = true,
}) => (
  <table className="border w-full">
    <thead>
      <tr className="grid grid-cols-12 text-left gap-x-2 py-2 bg-gray-100">
        <th className="col-span-3 pl-1">
          name <span className="text-gray-400 text-xs">(index)</span>
        </th>
        <th className="col-span-1">type</th>
        <th className="col-span-8 pr-1">value</th>
      </tr>
      {!hasParamNames && (
        <tr className="grid grid-cols-12 text-left gap-x-2 py-2 bg-yellow-100 text-red-700">
          <th className="col-span-12 px-1">Parameter names are not available.</th>
        </tr>
      )}
    </thead>
    <tbody className="divide-y">
      {args.map((r, i) => (
        <DecodedParamRow
          key={i}
          i={i}
          r={r}
          paramType={paramTypes[i]}
          txData={txData}
        />
      ))}
    </tbody>
  </table>
);

export default React.memo(DecodedParamsTable);
