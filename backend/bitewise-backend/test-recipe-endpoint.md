# Testing the Recipe Endpoints

After MongoDB connects successfully, test these endpoints:

## 1. Test GET /recipes (should return empty array or Edamam results)
```bash
curl http://localhost:5002/recipes?q=pasta
```

## 2. Test POST /my-recipes (add a recipe) - requires auth token
First login to get a token, then:
```bash
curl -X POST http://localhost:5002/my-recipes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Recipe",
    "ingredients": ["1 cup flour", "2 eggs"],
    "instructions": ["Mix ingredients", "Bake at 350F"],
    "healthLabels": ["Vegetarian", "Gluten-Free"]
  }'
```

## 3. Test GET /recipes again (should now include your user recipe)
```bash
curl http://localhost:5002/recipes?q=test
```

## 4. Test filtering
```bash
curl "http://localhost:5002/recipes?q=test&filters=vegetarian"
```
