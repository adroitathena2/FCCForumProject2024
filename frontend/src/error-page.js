import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div class="text-center min-vh-100 align-content-center">
      <h3>An error has occurred.</h3>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}