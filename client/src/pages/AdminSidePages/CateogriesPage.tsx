import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import CategoryForm from '../../components/categories/CategoryForm';
import CategoryList from '../../components/categories/CategoryList';

interface Category {
  _id: string;
  categoryName: string;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate(); // Initialize useNavigate

  // Redirect to login if token doesn't exist
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login'); // Redirect to login page
    } else {
      fetchCategories(); // Fetch categories if token exists
    }
  }, [navigate]); // Depend on navigate

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>('http://localhost:8080/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error("There was an error fetching the categories!", error);
    }
  };

  // Delete a category by ID
  const deleteCategory = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("There was an error deleting the category!", error);
    }
  };

  // Conditional rendering to avoid rendering page content if redirected
  if (!localStorage.getItem('token')) {
    return null; // Do not render the page content
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl text-[#495E57] mb-4">Manage Categories</h1>
      <CategoryForm fetchCategories={fetchCategories} />
      <CategoryList categories={categories} deleteCategory={deleteCategory} />
    </div>
  );
};

export default CategoriesPage;
