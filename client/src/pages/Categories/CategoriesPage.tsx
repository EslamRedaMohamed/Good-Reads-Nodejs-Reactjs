import React, { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CategoriesPage.css";

const { Title } = Typography;

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate();

  // Helper function to build the URL
  const buildBooksUrl = (categoryName: string, page: number) => {
    return `${import.meta.env.VITE_API_URL}/user/books-by-category?category=${categoryName}&page=${page}&limit=8`;
  };

  useEffect(() => {
    // Fetch categories on component mount
    axios.get(`${import.meta.env.VITE_API_URL}/user/categories`).then((response) => {
      setCategories(response.data);
    });
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    // Fetch books for the selected category using the helper function
    axios.get(buildBooksUrl(categoryName, currentPage)).then((response) => {
      setBooks(response.data.books);
      setTotalPages(response.data.totalPages);
    });
  };

  useEffect(() => {
    if (selectedCategory) {
      // Fetch books whenever the selected category or current page changes
      axios
        .get(buildBooksUrl(selectedCategory, currentPage))
        .then((response) => {
          setBooks(response.data.books);
          setTotalPages(response.data.totalPages);
        });
    }
  }, [selectedCategory, currentPage]);

  const handleCardClick = (bookId: string) => {
    navigate(`/Books/${bookId}`);
  };

  return (
    <div className="categories">
      <Title level={2}>Categories</Title>
      <Row gutter={16}>
        {categories.map((category) => (
          <Col span={6} key={category._id}>
            <Card
              hoverable
              onClick={() => handleCategoryClick(category.categoryName)}
            >
              <Card.Meta title={category.categoryName} />
            </Card>
          </Col>
        ))}
      </Row>

      {selectedCategory && (
        <div className="books">
          <Title level={3}>Books in {selectedCategory}</Title>
          <Row gutter={24}>
            {books.map((book) => (
              <Col span={6} key={book._id} className=" mb-6">
                <Card
                  hoverable
                  onClick={() => handleCardClick(book._id)}
                  cover={
                    <img
                      alt={book.name}
                      src={`${import.meta.env.VITE_API_URL}/${book.photo}`}
                      style={{
                        width: "100%",
                        height: 400,
                        objectFit: "contain",
                      }}
                    />
                  }
                >
                  <Card.Meta title={book.name} description={book.authorName} />
                </Card>
              </Col>
            ))}
          </Row>
          <Pagination
            style={{ justifyContent: "center", marginBlock: 20 }}
            current={currentPage}
            total={totalPages * 10}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
