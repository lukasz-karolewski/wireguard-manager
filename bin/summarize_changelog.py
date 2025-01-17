#!/usr/bin/env python3

import os
import sys
from langchain import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from dotenv import load_dotenv

def create_summary_chain():
    load_dotenv()
    
    system_template = """You are a technical changelog summarizer. 
    Given a list of changelog entries, create a concise summary that captures the main updates and changes."""
    
    human_template = """Please summarize these changelog entries:
    {changelog_entries}
    
    Provide a brief, clear summary that highlights the most important changes.
    
    "bump" means update of libraries to the latest version
    """

    system_message_prompt = SystemMessagePromptTemplate.from_template(system_template)
    human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)
    chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])

    llm = ChatOpenAI(temperature=0.7, model_name="gpt-3.5-turbo")
    return LLMChain(llm=llm, prompt=chat_prompt)

def main():
    # Read the latest changelog section from stdin
    latest_entries = sys.stdin.read().strip()
    if not latest_entries:
        print("No changes to summarize")
        return

    # Create and run the summary chain
    chain = create_summary_chain()
    summary = chain.run(changelog_entries=latest_entries)
    
    # Print summary to stdout
    print(summary.strip())

if __name__ == "__main__":
    main()
