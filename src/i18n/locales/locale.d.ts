declare module "./*.yaml" {
  interface MessageTranslation {
    common: {
      login: string;
      username: string;
      passcode: string;
    };
  }

  const translation: {
    message: MessageTranslation;
  };
  export default translation;
}
