import React, { useState, useEffect } from "react";
import { Container, Grid, CssBaseline } from "@mui/material";
import Spinner from "./Spinner";

//Components
import ProductDetail from "./products/ProductDetail.";

const Homepage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        try {
            const fetchData = async () => {
                const response = await fetch("http://localhost:3000/api/products");
                const data = await response.json();
                setProducts(data.docs);
            };
            fetchData();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <CssBaseline />
                    <Container maxWidth="lg" style={{ padding: "24px" }}>
                        <Grid container spacing={3}>
                            {products?.map((product) => (
                                <Grid item key={product._id} xs={12} sm={6} md={4}>
                                    <ProductDetail product={product} />
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </>
            )}
        </>
    );
};

export default Homepage;
