import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/download-counts.json");

function readData() {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read download counts" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { logoName } = await request.json();
    const data = readData();

    data.totalDownloads += 1;
    data.logoDownloads[logoName] = (data.logoDownloads[logoName] || 0) + 1;

    writeData(data);

    return NextResponse.json({
      success: true,
      totalDownloads: data.totalDownloads,
      logoDownloads: data.logoDownloads,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update download count" },
      { status: 500 }
    );
  }
}
