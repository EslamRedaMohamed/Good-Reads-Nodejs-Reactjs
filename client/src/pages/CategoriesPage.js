import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryForm from '../components/categories/CategoryForm';
import CategoryList from '../components/categories/CategoryList';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("There was an error fetching the categories!", error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("There was an error deleting the category!", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl text-[#495E57] mb-4">Manage Categories</h1>
      <CategoryForm fetchCategories={fetchCategories} />
      <CategoryList categories={categories} deleteCategory={deleteCategory} />
    </div>
  );
};

export default CategoriesPage;
