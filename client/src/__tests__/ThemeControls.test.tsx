import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/theme/ThemeProvider";
import ThemeControls from "@/components/ThemeControls";

const user = userEvent.setup();

beforeEach(() => {
  document.documentElement.removeAttribute("data-theme");
  localStorage.clear();
  (window.matchMedia as unknown) = jest.fn().mockReturnValue({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  });
});

const setup = () =>
  render(
    <ThemeProvider>
      <ThemeControls />
    </ThemeProvider>
  );

test("toggle button flips between light/dark", async () => {
  setup();

  // initial (system->light)
  expect(document.documentElement.dataset.theme).toBe("light");

  await user.click(screen.getByRole("button", { name: /toggle color theme/i }));
  expect(document.documentElement.dataset.theme).toBe("dark");

  await user.click(screen.getByRole("button", { name: /toggle color theme/i }));
  expect(document.documentElement.dataset.theme).toBe("light");
});

test("select sets explicit theme", async () => {
  setup();

  const select = screen.getByRole("combobox", { name: /theme/i });
  await user.selectOptions(select, "dark");
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(select).toHaveValue("dark");

  await user.selectOptions(select, "system");
  // matchMedia mocked to light
  expect(document.documentElement.dataset.theme).toBe("light");
  expect(select).toHaveValue("system");
});
