import React, { useEffect, useState } from "react";
import PackageCard from "src/components/Dashboard/Admin/Packages/PackageCard/Index";
import TopBar from "src/components/Dashboard/Admin/Packages/TopBar/Index";
import { Col, Row } from "react-bootstrap";
import { getPackage } from "src/api/packagesAPI";

function Packages() {
  // State to store the packages data
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch packages data from the API

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data } = await getPackage();
      // const data = await response.json();
      setCardData(data);
    } catch (err) {
      setError("Failed to fetch packages.", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPackages();
  }, []);

  // Render loading state
  if (loading) return <div>Loading...</div>;

  // Render error state
  if (error) return <div>{error}</div>;

  return (
    <div>
      <TopBar />
      <Row className="mt-40 g-4">
        {cardData?.map((item) => (
          <Col key={item.id} md={4}>
            <PackageCard
              id={item.id}
              img={item.package_image || "default_image_path"} // Provide a default image path if package_image is missing
              title={item.title}
              price={item.price_adult}
              location={item.location}
              featured
              fetchPackages={fetchPackages}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Packages;
