import { BarChartFill, Newspaper, Clock } from 'react-bootstrap-icons'; 

const HomeBoard = () => {
    return (
        <>
            <div className="board-section-container">
                <div className="board-section"><BarChartFill/>Top</div>
                <div className="board-section"><Newspaper/>New</div>
                <div className="board-section"><Clock/>Old</div>
            </div>
            <MessageBoard />
        </>
    )
}

export default HomeBoard;