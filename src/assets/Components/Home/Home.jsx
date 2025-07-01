import React from "react";
import Header from "../../SmallComponents/Header/Header";
import BookList from "../../SmallComponents/BookList/BookList";
import Footer from "../../SmallComponents/Footer/Footer";
import StreakFeature from "../../SmallComponents/StreakBox/StreakBox.jsx"; 

export default function Home() {
    return (
        <>
            <StreakFeature /> 

            <div>  
                <Header />
                <BookList />
                <Footer />
            </div>
        </>
    );
}