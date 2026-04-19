import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import axios from "axios";
import API_BASE_URL from "../../config/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
          withCredentials: true,
        });
        setUsers(res.data.users || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p className="font-medium">Unable to load users</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Title
        align="left"
        font="oufit"
        title="Users"
        subTitle="View and manage registered users."
      />

      <div className="w-full max-w-4xl text-left border border-gray-300 rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium">Email</th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Role
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                  {user.fullName}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                  {user.email}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                  {user.role}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
