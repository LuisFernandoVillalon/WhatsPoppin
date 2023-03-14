const About = () => {
    return (
        <div>
            <div className="about-container">
                <p className="about-title">About Project</p>
                <p>
                    Welcome to What's Poppin'! I, Luis F. Villalon, built this site's front-end and set up its back-end services 
                    using Firebase console, for my final project on <a target="_blank" className="about-link" href="https://www.theodinproject.com/">The Odin Project</a> JavaScript course. 
                    This is a simplified clone of the popular website, Reddit, made with the intentions of learning. If you have any questions or 
                    comments, feel free to contact via <a target="_blank" className="about-link" href="https://github.com/LuisFernandoVillalon">Github</a> or <a target="_blank" className="about-link" href="https://www.linkedin.com/in/luis-villalon/">LinkedIn</a>.
                </p>
            </div>
            <div className="about-container">
                <p className="about-title">Development Tools</p>
                <ul>
                    <li>HTML</li>
                    <li>CSS</li>
                    <li>JavaScript</li>
                    <li>React:
                        <ul>
                            <li>Style-components</li>
                            <li>Router</li>
                            <li>Use-state</li>
                            <li>Use-Effect</li>
                        </ul>
                    </li>
                    <li>Bootstrap icons</li>
                    <li>Firebase:
                        <ul>
                            <li>Realtime Database</li>
                            <li>Authentication</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default About;