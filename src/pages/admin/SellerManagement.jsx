import { useEffect, useState } from "react";
import { Table, Button, Modal, Popconfirm, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSellers,
  createSeller,
  deleteSeller,
  updateSeller,
} from "../../features/seller/sellerSlice";
import SellerForm from "./../../components/SellerForm";
import { toast } from 'react-toastify';

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
    setFilteredSellers(sellers);
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

      if (result.errCode !== 0) {
        return;
      }

      await dispatch(fetchSellers());
      setIsModalOpen(false);
      setEditingSeller(null);
    } catch {
      toast.error("Không thể thực hiện yêu cầu.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await dispatch(deleteSeller(id)).unwrap();

      if (result.errCode !== 0) {
        toast.error(result.errMessage || "Xoá thất bại.");
        return;
      }

      toast.success("Xoá người bán thành công!");
      await dispatch(fetchSellers());
    } catch {
      toast.error("Xoá thất bại.");
    }
  };

  const handleSearch = (value) => {
    const filtered = sellers.filter(
      (seller) =>
        seller.fullName.toLowerCase().includes(value.toLowerCase()) ||
        seller.phoneNumber.toLowerCase().includes(value.toLowerCase()) ||
        seller.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSellers(filtered);
  };

  const columns = [
    { title: "Họ tên", dataIndex: "fullName" },
    { title: "Số điện thoại", dataIndex: "phoneNumber" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Mã QR",
      dataIndex: "qrCodeUrl",
      render: (url) => url && <img src={url} alt="qr" width={50} />,
    },
    {
      title: "Thao tác",
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
            Chỉnh sửa
          </Button>
          <Popconfirm title="Bạn có chắc chắn muốn xoá?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger>
              Xoá
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
          Thêm người bán
        </Button>

        <Search
          placeholder="Tìm theo tên, số điện thoại hoặc email"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
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
        title={editingSeller ? "Chỉnh sửa người bán" : "Thêm người bán"}
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
