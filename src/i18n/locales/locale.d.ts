declare module "./*.yaml" {
  interface MessageTranslation {
    welcome: string;
  }

  const translation: {
    message: MessageTranslation;
  };
  export default translation;
}
