import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import './Create.css'

interface ProductForm {
    title: string,
    id: string,
    price: string,
    url: string
}

const initialState: ProductForm = {
    title: "",
    id: "",
    price: "",
    url: ""
}

const Create = () => {
    const [posts, setForm] = useState<ProductForm>(initialState)
    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();

    const { data: product } = useQuery({
        queryKey: ['products'],
        queryFn: () => {
            return axios
                .get('https://676d57bd0e299dd2ddff3c52.mockapi.io/Product')
                .then(res => res.data)
        }
    });

    const createProduct = useMutation({
        mutationFn: (product: ProductForm) => {
            return axios.post('https://676d57bd0e299dd2ddff3c52.mockapi.io/Product', product);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['products']});
        }
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
    }
    
    const updateProduct = useMutation({
        mutationFn: (update: ProductForm) => {
            return axios.put(`https://676d57bd0e299dd2ddff3c52.mockapi.io/Product/${update.id}`, update);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['products']});
        }
    });
    
    
    
    
    
    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEditing) {
            updateProduct.mutate(posts);
            setIsEditing(false);
        } else {
            createProduct.mutate(posts);
        }
        setForm(initialState);
    }
    
    const handleEdit = (product: ProductForm) => {
        setForm(product);
        setIsEditing(true);
    }
    const deleteProduct = useMutation({
        mutationFn: (id: string) => {
            return axios.delete(`https://676d57bd0e299dd2ddff3c52.mockapi.io/Product/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['products']});
        }
    });
    
    const handleDelete = (id: string) => {
        deleteProduct.mutate(id);
    }

    return (
        <div className='main'>
            <div className='card'>
                <form className='form' onSubmit={handleSubmit} action=''>
                <h2 className='title'>Create Products</h2>                
                        <input type="text" name="title" placeholder="Title" value={posts.title} onChange={handleChange} />
                        <input type="text" name="price" placeholder="Price" value={posts.price} onChange={handleChange} />
                        <input type="" name="url"  placeholder="Image" value={posts.url} onChange={handleChange} />
                    <button>{isEditing ? 'Update Product' : 'Create Product'}</button>
                </form>

                <div className='wrapper'>
                    <h2>Products</h2>
                    <div>
                        {product?.map((item: ProductForm) => (
                            <div key={item.id} className='card-item'>
                                <img src={item.url} width={300} alt={item.title}/>
                                <div className='text'>
                                    <p className='desc'>{item.title}</p>
                                    <p>{item.price}$</p>
                                    <div className='btns'>
                                        <button onClick={() => handleEdit(item)}>Edit</button>
                                        <button onClick={() => handleDelete(item.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Create