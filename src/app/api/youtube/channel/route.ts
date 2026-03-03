import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  
  if (!session?.youtubeAccessToken) {
    return NextResponse.json(
      { error: "YouTube access not granted. Please sign in with YouTube." },
      { status: 401 }
    )
  }

  try {
    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
      {
        headers: {
          Authorization: `Bearer ${session.youtubeAccessToken}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error("YouTube API error:", error)
      return NextResponse.json(
        { error: "Failed to fetch YouTube channel data" },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: "No YouTube channel found for this account" },
        { status: 404 }
      )
    }

    const channel = data.items[0]
    
    return NextResponse.json({
      id: channel.id,
      name: channel.snippet.title,
      description: channel.snippet.description,
      customUrl: channel.snippet.customUrl,
      thumbnail: channel.snippet.thumbnails?.default?.url,
      subscriberCount: parseInt(channel.statistics.subscriberCount, 10),
      videoCount: parseInt(channel.statistics.videoCount, 10),
      viewCount: parseInt(channel.statistics.viewCount, 10),
    })
  } catch (error) {
    console.error("Error fetching YouTube channel:", error)
    return NextResponse.json(
      { error: "Failed to fetch YouTube channel data" },
      { status: 500 }
    )
  }
}
