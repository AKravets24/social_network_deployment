import React from 'react';
import stl from './notFound.module.css'

const NotFound = () => {
    return <div className={stl.background}>
        <div className={stl.header}><h1> 404 Page not found </h1></div>
        <div className={stl.wrapper}>
            <div className={stl.samurai}/>
            <div className={stl.japanSun}/>
        </div>
    </div>

};
export default NotFound;
