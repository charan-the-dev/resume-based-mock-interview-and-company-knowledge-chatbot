import { NextResponse } from "next/server";

const topics = [
    "Favorite travel destinations and why",
    "Best meals or recipes to recommend",
    "Hobbies people are passionate about",
    "Recent movies or TV shows you loved",
    "Books that changed your perspective",
    "Fun facts or surprising skills you have",
    "Childhood memories that still make you smile",
    "Hidden talents or party tricks",
    "Dream jobs or what you'd do on a sabbatical",
    "Useful tech or gadgets you can't live without",
    "Local restaurants, cafes, or spots to recommend",
    "Bucket list experiences you'd like to try",
    "Life hacks you swear by",
    "New skills you'd like to learn this year",
    "Playful 'would you rather' or hypothetical prompts",
    "Most meaningful compliment or piece of advice you've received",
    "Memorable concerts, festivals, or live events",
    "Sustainable habits or small changes you practice",
    "Guilty pleasure songs, shows, or snacks",
    "Group game or activity suggestions for a meetup"
];

function getRandomIndex() {
    return Math.floor(Math.random() * topics.length);
}

export async function GET() {
    const topic = topics[getRandomIndex()];
    return NextResponse.json({
        topic
    });
}