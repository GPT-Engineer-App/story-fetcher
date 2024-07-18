import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const fetchTopStories = async () => {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const storyIds = await response.json();
  return Promise.all(
    storyIds.slice(0, 100).map(async (id) => {
      const storyResponse = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      return storyResponse.json();
    })
  );
};

const StoryCard = ({ story }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">{story.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-500 mb-2">Upvotes: {story.score}</p>
      <a
        href={story.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline flex items-center"
      >
        Read more <ExternalLink className="ml-1 h-4 w-4" />
      </a>
    </CardContent>
  </Card>
);

const SkeletonCard = () => (
  <Card className="mb-4">
    <CardHeader>
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
    </CardHeader>
    <CardContent>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </CardContent>
  </Card>
);

const HackerNewsTopStories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: stories, isLoading } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  const filteredStories = stories?.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Hacker News Top 100 Stories</h1>
      <Input
        type="text"
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
      />
      {isLoading ? (
        Array.from({ length: 10 }).map((_, index) => <SkeletonCard key={index} />)
      ) : (
        filteredStories?.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))
      )}
    </div>
  );
};

export default HackerNewsTopStories;