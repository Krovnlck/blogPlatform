import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import "./ProfilePage.css";
import { useUpdateUserMutation } from "../features/authApi";

const ProfilePage = ({ user, onUserUpdate }) => {
  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      image: user?.image || "",
      password: ""
    }
  });
  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    reset({
      username: user?.username || "",
      email: user?.email || "",
      image: user?.image || "",
      password: ""
    });
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      const result = await updateUser({
        user: {
          username: data.username,
          email: data.email,
          image: data.image,
          ...(data.password ? { password: data.password } : {})
        }
      }).unwrap();
      
      onUserUpdate(result.user);
      alert("Профиль успешно обновлён!");
      reset({ ...data, password: "" });
    } catch (err) {
      if (err.data?.errors) {
        Object.entries(err.data.errors).forEach(([field, messages]) => {
          setError(field, { type: "server", message: messages.join(", ") });
        });
      } else {
        alert("Ошибка обновления профиля");
      }
    }
  };

  return (
    <div className="profile-page">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="form-label">Username</label>
          <input
            className="form-input"
            placeholder="Username"
            {...register("username", { required: "Required" })}
          />
          {errors.username && <div className="error-message">{errors.username.message}</div>}
        </div>
        <div>
          <label className="form-label">Email address</label>
          <input
            className="form-input"
            placeholder="Email address"
            {...register("email", { required: "Required", pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Invalid email" } })}
          />
          {errors.email && <div className="error-message">{errors.email.message}</div>}
        </div>
        <div>
          <label className="form-label">New password</label>
          <input
            className="form-input"
            type="password"
            placeholder="New password"
            {...register("password", { minLength: { value: 6, message: "Min 6 chars" }, maxLength: { value: 40, message: "Max 40 chars" } })}
          />
          {errors.password && <div className="error-message">{errors.password.message}</div>}
        </div>
        <div>
          <label className="form-label">Avatar image (url)</label>
          <input
            className="form-input"
            placeholder="Avatar image"
            {...register("image", { pattern: { value: /^https?:\/\/.+/, message: "Invalid url" } })}
          />
          {errors.image && <div className="error-message">{errors.image.message}</div>}
        </div>
        <button type="submit" className="form-button">Save</button>
      </form>
    </div>
  );
};

export default ProfilePage; 