import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
      const cart = useLoaderData();
    const [products, setProducts] = useState([]);
  //  const [cart, setCart] = useState([])
    const [itemperPage,setItemPerPAge]=useState(10)
    const [currentpage,setCurrentPage]=useState(0)
 //   const {count}=useLoaderData()
 
 

const [count,setcount]=useState(0)
useEffect(()=>{
    fetch('http://localhost:5000/productsCount')
    .then(res=>res.json())
    .then(data=>setcount(data.count))
})
    const numberOfPAges=Math.ceil(count/itemperPage)
    const pages=[]
    // for(let i=0;i < numberOfPAges;i++){
    //     pages.push(i)
    // }
    // console.log(pages)

const pages2=[...Array(numberOfPAges).keys()]



    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${currentpage}&size=${itemperPage}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [currentpage,itemperPage]);

    // useEffect(() => {
    //     const storedCart = getShoppingCart();
    //     const savedCart = [];
    //     // step 1: get id of the addedProduct
    //     for (const id in storedCart) {
    //         // step 2: get product from products state by using id
    //         const addedProduct = products.find(product => product._id === id)
    //         if (addedProduct) {
    //             // step 3: add quantity
    //             const quantity = storedCart[id];
    //             addedProduct.quantity = quantity;
    //             // step 4: add the added product to the saved cart
    //             savedCart.push(addedProduct);
    //         }
    //         // console.log('added Product', addedProduct)
    //     }
    //     // step 5: set the cart
    //    // setCart(savedCart);
    // }, [products])

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }
const handleitemPerpage=(e)=>{
    const value=parseInt(e.target.value)
    console.log(value)
   setItemPerPAge(value)
   setCurrentPage(0)
}
const handlePrevPage=()=>{
    if(currentpage>0){
       setCurrentPage(currentpage-1)
    }
}
const handleNextPage=()=>{
    if(currentpage+1<numberOfPAges){
       setCurrentPage(currentpage+1)
    }
}
    return (
        <div className='shop-container'>
            <div className="products-container">
            
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
              
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div className='pagination'>
            <button onClick={handlePrevPage}>Previous</button>   
{
    pages2.map((page,i)=>
    <button onClick={()=>setCurrentPage(page)} className={currentpage===page?'selected':''} key={i}> 
        {page}
        </button>)
}
<button onClick={handleNextPage}>Next</button>
<select value={itemperPage} onChange={handleitemPerpage} name="" id="">
<option value="5">5</option>
<option value="10">10</option>
<option value="20">20</option>
<option value="30">30</option>
<option value="40">40</option>


</select>

            </div>
        </div>
    );
};

export default Shop;