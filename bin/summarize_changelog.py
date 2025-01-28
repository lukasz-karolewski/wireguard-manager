#!/usr/bin/env python3

import os
import sys
from langchain_openai import ChatOpenAI
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from dotenv import load_dotenv

def check_env_vars():
    required_vars = ["OPENAI_API_KEY"]
    missing_vars = [var for var in required_vars if var not in os.environ]
    if missing_vars:
        print(f"Missing required environment variables: {', '.join(missing_vars)}")
        sys.exit(1)

def create_summary_chain():
    system_template = """You are a technical changelog summarizer. 
    Given a list of changelog entries, create a concise summary that captures the main updates and changes. 
    Group simmilar changes together and provide a brief description of each group. Try to capture what changes mean for the user. and do not itemize every single change."""
    
    human_template = """Please summarize these changelog entries:
    {input}
    
    Provide a brief, clear summary that highlights the most important changes. Call is Summary of Changes.
    
    "bump" means update of libraries to the latest version, do not use that vernacular directly in the summary.
    """

    system_message_prompt = SystemMessagePromptTemplate.from_template(system_template)
    human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)
    chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])

    llm = ChatOpenAI(temperature=0, model_name="gpt-4o", max_tokens=1000)
    chain = chat_prompt | llm
    return chain

def main():
    load_dotenv()
    check_env_vars()

    # Read the latest changelog section from stdin
    latest_entries = sys.stdin.read().strip()
    if not latest_entries:
        print("No changes to summarize")
        return

    # Create and run the summary chain
    chain = create_summary_chain()
    summary = chain.invoke({"input": latest_entries})
    
    # Print summary to stdout
    print(summary.content.strip())

if __name__ == "__main__":
    main()
