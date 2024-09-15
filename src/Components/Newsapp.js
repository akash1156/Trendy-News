import React, { useEffect, useState } from 'react';
import Card from './Card';
import Footer from './Footer';

const Newsapp = () => {
    const [search, setSearch] = useState("india");
    const [newsData, setNewsData] = useState(null);
    const API_KEY = "234020b2035e4b548b60aae969e3a27e";

    const getData = async () => {
        try {
            const response = await fetch(`https://newsapi.org/v2/everything?q=${search}&apiKey=${API_KEY}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jsonData = await response.json();
            if (jsonData.articles) {
                const dt = jsonData.articles.slice(0, 10); // Safely slicing the data
                setNewsData(dt);
            } else {
                setNewsData([]); // Set empty data if no articles are found
            }
        } catch (error) {
            console.error("Error fetching the data:", error);
        }
    };

    useEffect(() => {
        getData(); // Fetch the data when the component mounts
    }, [search]); // Refetch data when the search term changes

    const handleInput = (e) => {
        setSearch(e.target.value); // Update search state on user input
    };

    const userInput = (event) => {
        setSearch(event.target.value); // Update search based on button click
    };

    return (
        <div>
            <nav>
                <div>
                    <h1>Trendy News</h1>
                </div>
                <ul style={{ display: "flex", gap: "11px" }}>
                    <a style={{ fontWeight: 600, fontSize: "17px" }}>All News</a>
                    <a style={{ fontWeight: 600, fontSize: "17px" }}>Trending</a>
                </ul>
                <div className='searchBar'>
                    <input type='text' placeholder='Search News' value={search} onChange={handleInput} />
                    <button onClick={getData}>Search</button>
                </div>
            </nav>
            <div>
                <p className='head'>Stay Updated with TrendyNews</p>
            </div>
            <div className='categoryBtn'>
                <button onClick={userInput} value="sports">Sports</button>
                <button onClick={userInput} value="politics">Politics</button>
                <button onClick={userInput} value="entertainment">Entertainment</button>
                <button onClick={userInput} value="health">Health</button>
                <button onClick={userInput} value="fitness">Fitness</button>
            </div>

            <div>
                {newsData ? <Card data={newsData} /> : <p>No news available for "{search}".</p>}
            </div>

            <Footer />
        </div>
    );
};

export default Newsapp;
