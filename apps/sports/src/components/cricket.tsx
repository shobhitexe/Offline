import {
  buttonVariants,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import Link from "next/link";

type Data = {
  competition: { id: string; name: string };
  competitionRegion: string;
  marketCount: number;
};

async function getData(): Promise<Data[]> {
  try {
    const res = await fetch("http://localhost:8080/api/v1/sports/getList?id=4");

    if (res.status !== 200) {
      return [];
    }

    const _res = await res.json();
    return _res.data || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export default async function CricketComponent() {
  const data: Data[] = await getData();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Competition Name</TableHead>
          <TableHead>Region</TableHead>
          <TableHead>Market Count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index} className="cursor-pointer">
            <TableCell>{item.competition.name}</TableCell>
            <TableCell>{item.competitionRegion}</TableCell>
            <TableCell>{item.marketCount}</TableCell>
            <TableCell>
              <Link
                href={`/cricket/${item.competition.id}`}
                className={buttonVariants({ variant: "yellow" })}
              >
                View
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
