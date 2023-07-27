class Mw < Formula
  desc "The mittwald command-line tool"
  homepage "https://github.com/mittwald/cli"
  url "https://mittwald-cli.s3.eu-central-1.amazonaws.com/versions/__VERSION__/__VERSIONHASH__/mw-v__VERSION__-__VERSIONHASH__-darwin-x64.tar.xz"
  sha256 "__SHA_X64__"
  version "__VERSION__"
  version_scheme 1

  on_macos do
    if Hardware::CPU.arm?
      url "https://mittwald-cli.s3.eu-central-1.amazonaws.com/versions/__VERSION__/__VERSIONHASH__/mw-v__VERSION__-__VERSIONHASH__-darwin-arm64.tar.xz"
      sha256 "__SHA_ARM64__"
    end
  end

  def install
    inreplace "bin/mw", /^CLIENT_HOME=/, "export MW_OCLIF_CLIENT_HOME=#{lib/"client"}\nCLIENT_HOME="
    libexec.install Dir["*"]
    bin.install_symlink libexec/"bin/mw"
  end

  test do
    system bin/"mw", "--version"
  end
end