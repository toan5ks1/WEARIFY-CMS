import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddCategoryForm } from "./components/category-form";

export default async function NewCategoryPage() {
  return (
    <Card
      id="new-store-page-form-container"
      aria-labelledby="new-store-page-form-heading"
    >
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Add store</CardTitle>
        <CardDescription>Add a new store to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <AddCategoryForm />
      </CardContent>
    </Card>
  );
}
