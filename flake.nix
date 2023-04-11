{
  inputs = {
    nixpkgs.url = "nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config = {
            allowUnfree = true;
          };
        };
        node = pkgs.nodejs-18_x;
        yarn = pkgs.yarn.override {
          nodejs = pkgs.nodejs-18_x;
        };
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = [
            node
            yarn
          ];
        };
      });
}