import About from "./About";
import HomeBoard from "./HomeBoard";
import "../styles.css";

const Content = () => {
    return (
        <div className="content-container">
            <div>
                <HomeBoard /> 
            </div>
            <div>
                <About />
            </div>
        </div>
    )
}

export default Content;