import React from "react";

export default function Header() {
  return (
    <section>
      <nav className="navbar navbar-expand-lg bg-primary">
        <div className="container-fluid d-flex justify-content-between pt-2">
          <button
            className="btn btn-primary btn-md"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sideMenu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              fill="currentColor"
              className="bi bi-list"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </button>
          <h2>Sandbagger 2024</h2>
          <div>
            <button className="btn btn-md btn-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2rem"
                height="2rem"
                fill="currentColor"
                className="bi bi-person-circle"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      <div
        className="offcanvas offcanvas-start"
        data-bs-scroll="true"
        data-bs-backdrop="false"
        tabindex="-1"
        id="sideMenu"
        aria-labelledby="SideMenu"
      >
        <div className="offcanvas-header border-bottom border-grey">
          <h5 className="offcanvas-title">Options</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        {/* --------------  Side Menu -------------------------------- */}
        <div className="offcanvas-body">
          <ul className="nav flex-column">
            {/* ------------------ Edit Profile -------------------- */}
            <li className="nav-item border-bottom border-grey">
              <a className="d-flex flex-row justify-content-between text-decoration-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" className="bi bi-person-circle me-3" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                </svg>
                <div>
                  <h3 className="active" aria-current="page" href="#">Edit Profile</h3>
                  <small>Click here to edit your profile</small>
                </div>
                <div class="flex-grow-1"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" className="bi bi-chevron-right " viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
              </a>
            </li>
            {/* ---------------------------- Link ----------------------------------- */}
            <li className="nav-item border-bottom border-grey">
              <a className="nav-link" href="#">Link</a>
            </li>
            <li className="nav-item border-bottom border-grey">
              <a className="nav-link" href="#">Link 2</a>
            </li>
            <li className="nav-item border-bottom border-grey">
              <a className="nav-link disabled" aria-disabled="true">Disabled Link</a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
