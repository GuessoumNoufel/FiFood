import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import toast from "react-hot-toast";
import { getUserProfile, updateMe } from "../API/users";
import { AuthContext } from "../context/AuthContextObject";
import { countries } from "../data/countries";

const BIO_LIMIT = 250;

const Page = styled.div`
  max-width: 620px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  font-family: "Inter", sans-serif;
`;

const Title = styled.h1`
  font-family: "Fraunces", Georgia, serif;
  font-size: 30px;
  color: #c1592a;
  margin: 0 0 4px;
`;

const Subtitle = styled.p`
  color: #8a7f6e;
  margin: 0 0 32px;
`;

const SectionLabel = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #2b2620;
  margin: 0 0 10px;
`;

const Field = styled.div`
  margin-bottom: 26px;
`;

const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Avatar = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  background: #f0e9dc;
`;

const CoverPreview = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  background: #f0e9dc;
  display: block;
  margin-bottom: 12px;
`;

const IconButton = styled.button`
  border: 1px solid #e8e0d4;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 13px;
  background: #fff;
  color: #2b2620;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #f5efe4;
  }
`;

const TrashButton = styled(IconButton)`
  padding: 8px 12px;
  color: #c0392b;
`;

const HelpText = styled.p`
  font-size: 12px;
  color: #a69c8c;
  margin: 8px 0 0;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #2b2620;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #e8e0d4;
  border-radius: 8px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #c1592a;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #e8e0d4;
  border-radius: 8px;
  font-size: 14px;
  min-height: 90px;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: #c1592a;
  }
`;

const CharCount = styled.div`
  text-align: right;
  font-size: 12px;
  color: #a69c8c;
  margin-top: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #e8e0d4;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  outline: none;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 36px;
`;

const SaveButton = styled.button`
  background: #3e4a2c;
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const CancelButton = styled.button`
  background: none;
  border: 1px solid #e8e0d4;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 14px;
  color: #4a4238;
  cursor: pointer;

  &:hover {
    background: #f5efe4;
  }
`;

function EditProfile() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [removePhoto, setRemovePhoto] = useState(false);

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [removeCover, setRemoveCover] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile(user._id)
      .then((res) => {
        const p = res.data.user;
        setName(p.name || "");
        setBio(p.bio || "");
        setCountry(p.country || "");
        setPhotoPreview(p.photo || "");
        setCoverPreview(p.coverImage || "");
      })
      .finally(() => setLoading(false));
  }, [user._id]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setRemovePhoto(false);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setRemoveCover(false);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview("");
    setRemovePhoto(true);
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview("");
    setRemoveCover(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("country", country);

    if (photoFile) formData.append("photo", photoFile);
    else if (removePhoto) formData.append("removePhoto", "true");

    if (coverFile) formData.append("coverImage", coverFile);
    else if (removeCover) formData.append("removeCoverImage", "true");
    try {
      const res = await updateMe(formData);
      login(res.data);
      toast.success("Profile updated!");
      navigate(`/profile/${user._id}`);
    } catch (err) {
      toast.error("Could not update profile");
      console.log(err);
    }
  };

  if (loading) return <p style={{ padding: "48px" }}>Loading...</p>;

  return (
    <Page>
      <Title>Edit Profile</Title>
      <Subtitle>
        Update your personal information and make your profile yours.
      </Subtitle>

      <form onSubmit={handleSubmit}>
        <Field>
          <SectionLabel>Profile Image</SectionLabel>
          <AvatarRow>
            <Avatar
              src={photoPreview || "https://via.placeholder.com/72"}
              alt="Profile"
            />
            <IconButton as="label" htmlFor="photo-upload">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
              </svg>
              Change image
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: "none" }}
              />
            </IconButton>
            <TrashButton type="button" onClick={handleRemovePhoto}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </TrashButton>
          </AvatarRow>
          <HelpText>JPG, PNG or WebP. Max 5MB.</HelpText>
        </Field>

        <Field>
          <SectionLabel>Cover Image</SectionLabel>
          <CoverPreview
            src={coverPreview || "https://via.placeholder.com/600x150"}
            alt="Cover"
          />
          <div style={{ display: "flex", gap: 10 }}>
            <IconButton as="label" htmlFor="cover-upload">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
              </svg>
              Change cover image
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                style={{ display: "none" }}
              />
            </IconButton>
            <TrashButton type="button" onClick={handleRemoveCover}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </TrashButton>
          </div>
          <HelpText>JPG, PNG or WebP. Max 10MB.</HelpText>
        </Field>

        <Field>
          <Label>Name</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Field>

        <Field>
          <Label>Bio</Label>
          <TextArea
            value={bio}
            maxLength={BIO_LIMIT}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people about yourself..."
          />
          <CharCount>
            {bio.length}/{BIO_LIMIT}
          </CharCount>
        </Field>

        <Field>
          <Label>Country</Label>
          <Select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">Select a country</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>

        <Actions>
          <SaveButton type="submit">Save changes</SaveButton>
          <CancelButton type="button" onClick={() => navigate(-1)}>
            Cancel
          </CancelButton>
        </Actions>
      </form>
    </Page>
  );
}

export default EditProfile;
