import { describe, expect, it } from "vitest";
import { editFileUrl, issueFormUrl, newFileUrl } from "./github";

describe("GitHub links", () => {
  it("prefills issue form fields by id", () => {
    const url = new URL(issueFormUrl("request.yml", { kind: "Add a recipe", subject: "Pho", link: "" }, "[Request] Pho"));
    expect(url.pathname).toBe("/hynding/in2eat/issues/new");
    expect(url.searchParams.get("template")).toBe("request.yml");
    expect(url.searchParams.get("subject")).toBe("Pho");
    expect(url.searchParams.get("title")).toBe("[Request] Pho");
    expect(url.searchParams.has("link")).toBe(false);
  });

  it("opens the new-file page with path and contents", () => {
    const url = new URL(newFileUrl("content/recipes/pho.yaml", "title: Pho\n"));
    expect(url.pathname).toBe("/hynding/in2eat/new/main");
    expect(url.searchParams.get("filename")).toBe("content/recipes/pho.yaml");
    expect(url.searchParams.get("value")).toBe("title: Pho\n");
  });

  it("links to the editor for existing files", () => {
    expect(editFileUrl("content/recipes/pho.yaml")).toBe("https://github.com/hynding/in2eat/edit/main/content/recipes/pho.yaml");
  });
});
