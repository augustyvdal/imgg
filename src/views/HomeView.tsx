export default function GeneralView() {
    
    return (
        <div className="home-container" >
            <h1>Home</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <button onClick={() => window.location.href = "/game1"}>Go to Guess The Movie</button>
                <button onClick={() => window.location.href = "/game2"}>Go to Higher or Lower</button>
                <button onClick={() => window.location.href = "/game3"}>Go to Sort Game</button>
            </div>
        </div>
        
    );
}


