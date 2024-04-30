import { useState } from 'react';
import { UserProps } from "../types/user";
import { MdLocationPin } from "react-icons/md";
import { Link } from "react-router-dom";
import classes from './User.module.css';



const User = ({ login, avatar_url, followers, following, location }: UserProps) => {
    const [bestProjects, setBestProjects] = useState<any[]>([]); 
    const [loading, setLoading] = useState<boolean>(false); 

    const fetchBestProjects = async () => {
        setLoading(true);
        
        try {
            const response = await fetch(`https://api.github.com/users/${login}/repos`);
            const data = await response.json();
            
            const sortedProjects = data.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count).slice(0, 5);
                        setBestProjects(sortedProjects);
        } catch (error) {
            console.error('Erro ao obter os melhores projetos:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={classes.user}>
            <img src={avatar_url} alt={login} />
            <h2>{login}</h2>
            {location && (
                <p className={classes.location}>
                    <MdLocationPin />
                    <span>{location}</span>
                </p>
            )}
            <div className={classes.stats}>
                <div>
                    <p>Seguidores:</p>
                    <p className={classes.number}>{followers}</p>
                </div>
                <div>
                    <p>Seguindo:</p>
                    <p className={classes.number}>{following}</p>
                </div>
            </div>
            <button onClick={fetchBestProjects} disabled={loading}>Ver melhores projetos</button>
            {loading && <p>Carregando...</p>}
            {bestProjects.length > 0 && (
                <div>
                    <h3>Melhores Projetos:</h3>
                    <ul>
                        {bestProjects.map((project: any) => (
                            <li key={project.id}>
                                <a href={project.html_url} target="_blank" rel="noopener noreferrer">{project.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default User;
