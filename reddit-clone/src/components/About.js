const About = () => {
    return (
        <>
            <div className="about-container">
                <p className="about-title">About Project</p>
                <p>
                    Welcome to What's Poppin'! This was built by me, 
                    Luis F. Villalon, for my final project of <a href="https://www.theodinproject.com/">The Odin Project</a> JavaScript course. 
                    This is a simplified clone of the popular website Reddit and was built for learning purposes, 
                    not to replace said site. If you have any questions or comments, feel free to contact via <a href="https://github.com/LuisFernandoVillalon">Github</a> or <a href="https://www.linkedin.com/in/luis-villalon/">LinkedIn</a>.
                </p>
            </div>
            <div className="about-container">
                <p className="about-title">Development Tools</p>
                <ul>
                    <li>HTML, CSS, JavaScript</li>
                    <li>React:
                        <ul>
                            <li>Style-components</li>
                            <li>Router</li>
                            <li>Use-state</li>
                        </ul>
                    </li>
                    <li>Firebase:
                        <ul>
                            <li>Realtime Database</li>
                            <li>Authentication</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default About;