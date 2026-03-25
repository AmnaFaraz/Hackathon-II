"""
Panaversity Hackathon II — Phase I
Python Console TODO App
Run: python main.py
"""

import sys
from rich.console import Console
from todo_app import TodoApp
from display import (
    console,
    render_tasks,
    print_success,
    print_error,
    print_info,
    print_help,
)

app = TodoApp()


def parse_id(raw: str) -> int | None:
    try:
        val = int(raw)
        if val <= 0:
            raise ValueError
        return val
    except ValueError:
        print_error(f"Invalid ID: '{raw}'. Must be a positive integer.")
        return None


def cmd_add() -> None:
    console.print("[bold cyan]New Task[/bold cyan]")
    title = console.input("  Title: ").strip()
    if not title:
        print_error("Title cannot be empty.")
        return
    description = console.input("  Description (optional): ").strip()
    try:
        task = app.add(title, description)
        print_success(f"Task #{task.id} added: {task.title}")
    except ValueError as e:
        print_error(str(e))


def cmd_list(args: list[str]) -> None:
    filter_val = args[0].lower() if args else "all"
    if filter_val not in ("all", "pending", "completed"):
        print_error("Invalid filter. Use: all | pending | completed")
        return
    tasks = app.list(filter_val)  # type: ignore
    title_map = {"all": "All Tasks", "pending": "Pending Tasks", "completed": "Completed Tasks"}
    render_tasks(tasks, title=title_map[filter_val])
    print_info(f"{len(tasks)} task(s) shown.")


def cmd_complete(args: list[str]) -> None:
    if not args:
        print_error("Usage: complete <id>")
        return
    task_id = parse_id(args[0])
    if task_id is None:
        return
    try:
        task = app.complete(task_id)
        print_success(f"Task #{task.id} marked as complete: {task.title}")
    except ValueError as e:
        print_error(str(e))


def cmd_update(args: list[str]) -> None:
    if not args:
        print_error("Usage: update <id>")
        return
    task_id = parse_id(args[0])
    if task_id is None:
        return
    console.print(f"[bold cyan]Update Task #{task_id}[/bold cyan] (press Enter to keep current)")
    new_title = console.input("  New title: ").strip()
    new_desc = console.input("  New description: ").strip()
    try:
        task = app.update(
            task_id,
            title=new_title if new_title else None,
            description=new_desc if new_desc else None,
        )
        print_success(f"Task #{task.id} updated: {task.title}")
    except ValueError as e:
        print_error(str(e))


def cmd_delete(args: list[str]) -> None:
    if not args:
        print_error("Usage: delete <id>")
        return
    task_id = parse_id(args[0])
    if task_id is None:
        return
    success = app.delete(task_id)
    if success:
        print_success(f"Task #{task_id} deleted.")
    else:
        print_error(f"Task #{task_id} not found.")


def repl() -> None:
    console.print()
    console.print("[bold cyan]╔══════════════════════════════════╗[/bold cyan]")
    console.print("[bold cyan]║   Panaversity TODO — Phase I     ║[/bold cyan]")
    console.print("[bold cyan]╚══════════════════════════════════╝[/bold cyan]")
    console.print("[dim]Type 'help' for available commands.[/dim]\n")

    while True:
        try:
            raw = console.input("[bold cyan]todo>[/bold cyan] ").strip()
        except (KeyboardInterrupt, EOFError):
            console.print("\n[dim]Goodbye![/dim]")
            sys.exit(0)

        if not raw:
            continue

        parts = raw.split()
        cmd = parts[0].lower()
        args = parts[1:]

        if cmd == "add":
            cmd_add()
        elif cmd == "list":
            cmd_list(args)
        elif cmd == "complete":
            cmd_complete(args)
        elif cmd == "update":
            cmd_update(args)
        elif cmd == "delete":
            cmd_delete(args)
        elif cmd == "help":
            print_help()
        elif cmd in ("exit", "quit"):
            console.print("[dim]Goodbye![/dim]")
            sys.exit(0)
        else:
            print_error(f"Unknown command: '{cmd}'. Type 'help' for commands.")


if __name__ == "__main__":
    repl()
