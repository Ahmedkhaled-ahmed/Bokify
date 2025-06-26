import React, { useState, useEffect } from "react";
import head1 from "../../Images/head1.png";
import head2 from "../../Images/head2.png";
import Header from "../../SmallComponents/Header/Header";
import BookList from "../../SmallComponents/BookList/BookList";
import Footer from "../../SmallComponents/Footer/Footer";
import { motion } from "framer-motion";

export default function Home() {



  return <>
  <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
<Header/>
  <BookList/>
  <Footer/>    </motion.div>
  
      </>
}
