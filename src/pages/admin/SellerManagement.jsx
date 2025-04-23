import { useEffect, useState } from "react";
import { Table, Button, Modal, Popconfirm, message, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSellers,
  createSeller,
  deleteSeller,
  updateSeller,
} from "../../features/seller/sellerSlice";
import SellerForm from "./../../components/SellerForm";

const { Search } = Input;

const SellerManagement = () => {
  const dispatch = useDispatch();
  const { sellers, loading } = useSelector((state) => state.seller);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [filteredSellers, setFilteredSellers] = useState(sellers);

  useEffect(() => {
    dispatch(fetchSellers());
  }, [dispatch]);

  useEffect(() => {
    setFilteredSellers(sellers); // Set filtered sellers when `sellers` is updated
  }, [sellers]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      setSubmitLoading(true);

      let result;
      if (editingSeller) {
        result = await dispatch(updateSeller({ id: editingSeller.id, formData })).unwrap();
      } else {
        result = await dispatch(createSeller(formData)).unwrap();
      }

      // Kiểm tra errCode
      if (result.errCode !== 0) {
        message.error(result.errMessage || "Something went wrong");
        return; // Dừng lại, không refetch, không đóng modal
      }

      message.success(editingSeller ? "Seller updated!" : "Seller created!");
      await dispatch(fetchSellers()); // Refetch the sellers list

      setIsModalOpen(false);
      setEditingSeller(null);
    } catch {
      message.error("Request failed.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await dispatch(deleteSeller(id)).unwrap();

      if (result.errCode !== 0) {
        message.error(result.errMessage || "Delete failed.");
        return;
      }

      message.success("Deleted seller!");
      await dispatch(fetchSellers()); // Refetch the sellers list
    } catch {
      message.error("Delete failed.");
    }
  };

  const handleSearch = (value) => {
    // Filter sellers based on search value
    const filtered = sellers.filter(
      (seller) =>
        seller.fullName.toLowerCase().includes(value.toLowerCase()) ||
        seller.phoneNumber.toLowerCase().includes(value.toLowerCase()) ||
        seller.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSellers(filtered); // Set filtered sellers based on search
  };

  const columns = [
    { title: "Full Name", dataIndex: "fullName" },
    { title: "Phone", dataIndex: "phoneNumber" },
    { title: "Email", dataIndex: "email" },
    {
      title: "QR Code",
      dataIndex: "qrCodeUrl",
      render: (url) => url && <img src={url} alt="qr" width={50} />,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button
            size="small"
            onClick={() => {
              setEditingSeller(record);
              setIsModalOpen(true);
            }}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          style={{ marginRight: 16 }}
          onClick={() => {
            setEditingSeller(null);
            setIsModalOpen(true);
          }}
        >
          Add Seller
        </Button>

        {/* Search input without needing to click */}
        <Search
          placeholder="Search by Name, Phone, or Email"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)} // Live search
          style={{ width: 400 }}
        />
      </div>

      <Table
        dataSource={filteredSellers}
        columns={columns}
        rowKey="id"
        loading={loading}
      />

      <Modal
        open={isModalOpen}
        title={editingSeller ? "Edit Seller" : "Create Seller"}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingSeller(null);
        }}
        footer={null}
      >
        <SellerForm
          onFinish={handleCreateOrUpdate}
          initialValues={editingSeller || {}}
          loading={submitLoading}
        />
      </Modal>
    </div>
  );
};

export default SellerManagement;