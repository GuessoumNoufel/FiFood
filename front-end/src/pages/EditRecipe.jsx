import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import toast from "react-hot-toast";
import { getRecipe, updateRecipe } from "../API/recipes";
import { AuthContext } from "../context/authContext";
import LoadingPage from "../components/LoadingPage";

const Page = styled.main`
  width: min(100% - 3.2rem, 82rem);
  margin: 3.2rem auto 8rem;
  padding: 3.2rem;
  border: 1px solid #eee6da;
  border-radius: 2rem;
  background: #fffdf9;
  box-shadow: 0 1.8rem 5rem rgba(43, 38, 32, 0.07);
  font-family: "Inter", sans-serif;
  @media (max-width: 640px) { padding: 2rem; }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  margin-bottom: 2rem;
  color: #a9471f;
  font-size: 1.4rem;
  font-weight: 600;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

const Title = styled.h1`
  margin: 0 0 0.6rem;
  color: #2b2620;
  font: 700 3rem/1.2 "Fraunces", Georgia, serif;
`;

const Intro = styled.p`
  margin: 0 0 2.8rem;
  color: #807568;
  font-size: 1.4rem;
`;

const Field = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.7rem;
  color: #3e3932;
  font-size: 1.3rem;
  font-weight: 650;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 1.1rem 1.3rem;
  border: 1px solid #e4dbce;
  border-radius: 1rem;
  background: #fff;
  color: #2b2620;
  font: 1.4rem "Inter", sans-serif;
  outline: none;
  &:focus { border-color: #c1592a; box-shadow: 0 0 0 3px #c1592a1f; }
`;

const TextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 10rem;
  padding: 1.1rem 1.3rem;
  border: 1px solid #e4dbce;
  border-radius: 1rem;
  background: #fff;
  color: #2b2620;
  font: 1.4rem/1.55 "Inter", sans-serif;
  outline: none;
  resize: vertical;
  &:focus { border-color: #c1592a; box-shadow: 0 0 0 3px #c1592a1f; }
`;

const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 1.1rem 1.3rem;
  border: 1px solid #e4dbce;
  border-radius: 1rem;
  background: #fff;
  color: #2b2620;
  font: 1.4rem "Inter", sans-serif;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$cols || 2}, minmax(0, 1fr));
  gap: 1.6rem;
  @media (max-width: 640px) { grid-template-columns: 1fr; gap: 0; }
`;

const ImagePicker = styled.label`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  cursor: pointer;
`;

const Preview = styled.img`
  width: 14rem;
  height: 9rem;
  border-radius: 1.2rem;
  object-fit: cover;
  background: #f0e9dc;
`;

const PickHint = styled.span`
  color: #a9471f;
  font-size: 1.3rem;
  font-weight: 600;
`;

const ListRow = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
`;

const SmallButton = styled.button`
  flex: 0 0 auto;
  padding: 0 1.2rem;
  border: 1px solid #e8e0d4;
  border-radius: 0.9rem;
  background: #fff;
  color: #8a7f6e;
  font-size: 1.3rem;
  cursor: pointer;
  &:hover { background: #fff2ec; color: #a9471f; }
`;

const AddButton = styled.button`
  padding: 0.9rem 1.3rem;
  border: 1px dashed #d7a17f;
  border-radius: 0.9rem;
  background: transparent;
  color: #a9471f;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #fff7f0; }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 3rem;
`;

const SaveButton = styled.button`
  padding: 1.2rem 2.2rem;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #e9782e, #c64d17);
  color: #fff;
  font-size: 1.4rem;
  font-weight: 650;
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: wait; }
`;

const CancelButton = styled(Link)`
  padding: 1.1rem 1.8rem;
  border: 1px solid #e8e0d4;
  border-radius: 999px;
  color: #4a4238;
  font-size: 1.4rem;
  text-decoration: none;
`;

function EditRecipe() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "",
    area: "",
    time: "",
    servings: "",
    difficulty: "Medium",
    description: "",
  });
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);

  useEffect(() => {
    let isCurrent = true;
    getRecipe(id)
      .then((response) => {
        const data = response.data;
        if (!isCurrent) return;
        setRecipe(data);
        setForm({
          title: data.title ?? "",
          category: data.category ?? "",
          area: data.area ?? "",
          time: data.time ?? "",
          servings: data.servings ?? "",
          difficulty: data.difficulty ?? "Medium",
          description: data.description ?? "",
        });
        setImagePreview(data.image ?? "");
        setIngredients(data.ingredients?.length ? data.ingredients : [""]);
        setSteps(data.instructions?.split("\n").filter(Boolean) ?? [""]);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message ?? "Could not load recipe");
        if (isCurrent) setRecipe(null);
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => { isCurrent = false; };
  }, [id]);

  const isOwner =
    recipe &&
    user &&
    String(recipe.createdBy?._id ?? recipe.createdBy) === String(user._id);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    if (imageFile) formData.append("image", imageFile);
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    formData.append(
      "ingredients",
      JSON.stringify(ingredients.map((ingredient) => ingredient.trim()).filter(Boolean)),
    );
    formData.append(
      "instructions",
      steps.map((step) => step.trim()).filter(Boolean).join("\n"),
    );

    setSaving(true);
    try {
      await updateRecipe(id, formData);
      toast.success("Recipe updated!");
      navigate(`/recipe/${id}`, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Could not update recipe");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingPage message="Loading recipe for editing" />;
  if (!user) return <Navigate to="/login" replace />;
  if (!recipe || !isOwner) return <Navigate to={`/recipe/${id}`} replace />;

  return (
    <Page>
      <BackLink to={`/recipe/${id}`}>← Back to recipe</BackLink>
      <Title>Edit recipe</Title>
      <Intro>Update the details and keep your recipe current.</Intro>
      <form onSubmit={handleSubmit}>
        <Field>
          <Label>Recipe image</Label>
          <ImagePicker htmlFor="recipe-image">
            <Preview src={imagePreview} alt="Recipe preview" />
            <PickHint>Choose a new image (optional)</PickHint>
            <input
              id="recipe-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImage}
              hidden
            />
          </ImagePicker>
        </Field>
        <Field>
          <Label htmlFor="recipe-title">Recipe name</Label>
          <Input id="recipe-title" name="title" value={form.title} onChange={updateField} required />
        </Field>
        <Grid $cols={2}>
          <Field>
            <Label htmlFor="recipe-category">Category</Label>
            <Input id="recipe-category" name="category" value={form.category} onChange={updateField} />
          </Field>
          <Field>
            <Label htmlFor="recipe-area">Cuisine / area</Label>
            <Input id="recipe-area" name="area" value={form.area} onChange={updateField} />
          </Field>
        </Grid>
        <Grid $cols={3}>
          <Field>
            <Label htmlFor="recipe-time">Cooking time (minutes)</Label>
            <Input id="recipe-time" name="time" type="number" min="0" value={form.time} onChange={updateField} />
          </Field>
          <Field>
            <Label htmlFor="recipe-servings">Servings</Label>
            <Input id="recipe-servings" name="servings" type="number" min="0" value={form.servings} onChange={updateField} />
          </Field>
          <Field>
            <Label htmlFor="recipe-difficulty">Difficulty</Label>
            <Select id="recipe-difficulty" name="difficulty" value={form.difficulty} onChange={updateField}>
              <option>Easy</option><option>Medium</option><option>Hard</option>
            </Select>
          </Field>
        </Grid>
        <Field>
          <Label htmlFor="recipe-description">Description</Label>
          <TextArea id="recipe-description" name="description" maxLength={300} value={form.description} onChange={updateField} />
        </Field>
        <Grid $cols={2}>
          <Field>
            <Label>Ingredients</Label>
            {ingredients.map((ingredient, index) => (
              <ListRow key={index}>
                <Input
                  aria-label={`Ingredient ${index + 1}`}
                  value={ingredient}
                  onChange={(event) => setIngredients((items) => items.map((item, i) => i === index ? event.target.value : item))}
                />
                {ingredients.length > 1 && (
                  <SmallButton type="button" aria-label="Remove ingredient" onClick={() => setIngredients((items) => items.filter((_, i) => i !== index))}>×</SmallButton>
                )}
              </ListRow>
            ))}
            <AddButton type="button" onClick={() => setIngredients((items) => [...items, ""])}>+ Add ingredient</AddButton>
          </Field>
          <Field>
            <Label>Instructions</Label>
            {steps.map((step, index) => (
              <ListRow key={index}>
                <TextArea
                  aria-label={`Instruction step ${index + 1}`}
                  value={step}
                  onChange={(event) => setSteps((items) => items.map((item, i) => i === index ? event.target.value : item))}
                />
                {steps.length > 1 && (
                  <SmallButton type="button" aria-label="Remove step" onClick={() => setSteps((items) => items.filter((_, i) => i !== index))}>×</SmallButton>
                )}
              </ListRow>
            ))}
            <AddButton type="button" onClick={() => setSteps((items) => [...items, ""])}>+ Add step</AddButton>
          </Field>
        </Grid>
        <Actions>
          <CancelButton to={`/recipe/${id}`}>Cancel</CancelButton>
          <SaveButton type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</SaveButton>
        </Actions>
      </form>
    </Page>
  );
}

export default EditRecipe;
