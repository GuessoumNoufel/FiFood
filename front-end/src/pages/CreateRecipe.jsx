import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import toast from "react-hot-toast";
import { createRecipe } from "../API/recipes";
import { BackHome } from "./Discover";

const Page = styled.div`
  max-width: 82rem;
  margin: 0 auto;
  margin-top: -3rem;
  padding: 40px 24px 80px;
  font-family: "Inter", sans-serif;
`;

const RecipeBackHome = styled(BackHome)`
  margin: 3rem 0 0 3rem;
  display: flex;
  align-items: center;
  font-size: 1.6rem;
`;

const Title = styled.h1`
  font-family: "Fraunces", Georgia, serif;
  font-size: 30px;
  margin: 0 0 4px;
  color: #2b2620;
`;

const Subtitle = styled.p`
  color: #8a7f6e;
  margin: 0 0 28px;
  font-size: 1.3rem;
`;

const ImageDrop = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #e8e0d4;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  margin-bottom: 28px;
  cursor: pointer;

  &:hover {
    background: #fbf7f1;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #2b2620;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const Field = styled.div`
  margin-bottom: 22px;
`;

const Input = styled.input`
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #e8e0d4;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-family: "Inter", sans-serif;

  &:focus {
    border-color: #c1592a;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #e8e0d4;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-family: "Inter", sans-serif;
  background: #fff;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #e8e0d4;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  min-height: 90px;
  resize: vertical;
  font-family: "Inter", sans-serif;

  &:focus {
    border-color: #c1592a;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$cols || 3}, 1fr);
  gap: 16px;
`;

const IngredientRow = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 10px;
  margin-bottom: 10px;
`;

const AddButton = styled.button`
  background: none;
  border: 1px dashed #c1592a;
  color: #c1592a;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 4px;

  &:hover {
    background: #fbf1ea;
  }
`;

const StepRow = styled.div`
  gap: 12px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepNumber = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #c1592a;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SaveButton = styled.button`
  display: block;
  margin: 40px auto 0;
  background: #c1592a;
  color: #fff;
  border: none;
  padding: 14px 40px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #a64a22;
  }
`;

function CreateRecipe() {
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [time, setTime] = useState("");
  const [servings, setServings] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([{ quantity: "", name: "" }]);
  const [steps, setSteps] = useState([""]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const updateIngredient = (index, field, value) => {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)),
    );
  };

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { quantity: "", name: "" }]);
  };

  const updateStep = (index, value) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? value : s)));
  };

  const addStep = () => {
    setSteps((prev) => [...prev, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please upload a cover image");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("area", area);
    formData.append("time", time);
    formData.append("servings", servings);
    formData.append("difficulty", difficulty);
    formData.append("description", description);
    formData.append(
      "ingredients",
      JSON.stringify(
        ingredients
          .filter((ing) => ing.name.trim())
          .map((ing) => `${ing.quantity} ${ing.name}`.trim()),
      ),
    );
    formData.append("instructions", steps.filter((s) => s.trim()).join("\n"));

    try {
      const res = await createRecipe(formData);
      toast.success("Recipe created!");
      navigate(`/recipe/${res.data._id}`);
    } catch (err) {
      toast.error("Could not save recipe");
      console.log(err);
    }
  };

  return (
    <>
      <RecipeBackHome to="/">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-7"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
          />
        </svg>
        back home{" "}
      </RecipeBackHome>
      <Page>
        <Title>Create a Recipe</Title>
        <Subtitle>Let's make something delicious!</Subtitle>

        <form onSubmit={handleSubmit}>
          <ImageDrop htmlFor="image-upload">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="preview"
                style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8 }}
              />
            ) : (
              <>
                📷 <strong>Upload a cover image</strong>
                <div style={{ fontSize: 13, color: "#8A7F6E", marginTop: 4 }}>
                  Click to choose a file
                </div>
              </>
            )}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </ImageDrop>

          <Field>
            <Label>Recipe name</Label>
            <Input
              type="text"
              placeholder="e.g. Creamy Chicken Pasta"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Field>

          <Field>
            <Row $cols={2}>
              <div>
                <Label>Category</Label>
                <Input
                  type="text"
                  placeholder="e.g. Dinner, Lunch ... "
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div>
                <Label>Area</Label>
                <Input
                  type="text"
                  placeholder="e.g. Italian"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>
            </Row>
          </Field>

          <Field>
            <Row $cols={3}>
              <div>
                <Label>Cooking time (min)</Label>
                <Input
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div>
                <Label>Servings</Label>
                <Input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                />
              </div>
              <div>
                <Label>Difficulty</Label>
                <Select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </Select>
              </div>
            </Row>
          </Field>

          <Field>
            <Label>Description</Label>
            <TextArea
              placeholder="Tell people about your recipe..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>

          <Row $cols={2} style={{ alignItems: "start", gap: "32px" }}>
            <div>
              <Label>Ingredients</Label>
              {ingredients.map((ing, i) => (
                <IngredientRow key={i}>
                  <Input
                    type="text"
                    placeholder="e.g. 300g"
                    value={ing.quantity}
                    onChange={(e) =>
                      updateIngredient(i, "quantity", e.target.value)
                    }
                  />
                  <Input
                    type="text"
                    placeholder="e.g. Chicken breast"
                    value={ing.name}
                    onChange={(e) =>
                      updateIngredient(i, "name", e.target.value)
                    }
                  />
                </IngredientRow>
              ))}
              <AddButton type="button" onClick={addIngredient}>
                + Add ingredient
              </AddButton>
            </div>

            <div>
              <Label>Instructions</Label>
              {steps.map((step, i) => (
                <StepRow key={i}>
                  <StepNumber>{i + 1}</StepNumber>
                  <TextArea
                    placeholder={`Describe step ${i + 1}...`}
                    value={step}
                    onChange={(e) => updateStep(i, e.target.value)}
                    style={{ minHeight: "50px" }}
                  />
                </StepRow>
              ))}
              <AddButton type="button" onClick={addStep}>
                + Add step
              </AddButton>
            </div>
          </Row>

          <SaveButton type="submit">Save Recipe</SaveButton>
        </form>
      </Page>
    </>
  );
}

export default CreateRecipe;
